import { PolygonData } from '../../../utils/types.tsx'
import { BufferGeometryLoader, CircleGeometry, PlaneGeometry } from 'three'
//import { createHmac } from 'crypto';
//const subtle = window.crypto.subtle;
//import { str2ab } from '../../../utils/strings.ts'

interface PolygonFile {

  readonly version: number;
  readonly dimension: number;
  readonly payload: object;

  // whether the file is upgradable. can include contextual information through context
  canUpgrade(context?: object): boolean;
  // upgrade to the next version. can again provide contextual information through an argument
  upgrade(context?: object): PolygonFile;

  getPolygons(): PolygonData[];

  toSave(): string;
}

class v1 implements PolygonFile {
  version = 1;
  dimension = 2;
  payload: PolygonData[];

  // TODO: can you overload a constructor?
  constructor(polygons: string | PolygonData[]) {
    console.log("polygons: ", polygons)
    if (polygons instanceof Array ) {
      console.log('found an array')
      this.payload = polygons;
    }
    // otherwise we have a string
    // TODO: this is not type-safe since this has `any`, see https://stackoverflow.com/questions/38688822/how-to-parse-json-string-in-typescript
    else {
      console.log('found a string')
      const o = JSON.parse(polygons);
      // we're restoring a save, and so need to recreate BufferGeometry instances
      console.log('before:', o);
       const geometryLoader = new BufferGeometryLoader();
       o.payload.map((polygon: PolygonData) => {
         if (polygon.geometry.type === 'PlaneGeometry') {
           // have to recast since plane geometry is special
           console.log('plane geometry found', polygon.geometry)
           // parity miss between .toJSON() and object representation. when PlaneGeometry is instantiated,
           // the .parameters attribute is set as the parameters used in the constructor. however, when saving,
           // these parameters are added directly onto the rood object (i.e. saved as .width instead of
           // .parameters.width), which is why typescript is complaining here. shouldn't be too big of an issue since
           // we will scrap plane geometry due to not having any vertices.
           // so yeah, this is a dangerous, gross and ugly hack which should *not* make it to production
           const g = polygon.geometry as unknown as {width: number, height: number};
           polygon.geometry = new PlaneGeometry(g.width, g.height);
         }
         else if (polygon.geometry.type === 'CircleGeometry') {
           console.log('circle geometry found', polygon.geometry);
           const g = polygon.geometry as unknown as {radius: number, segments: number};
           polygon.geometry = new CircleGeometry(g.radius, g.segments);
         }
         else {
           polygon.geometry = geometryLoader.parse(polygon.geometry)
         }
       })
      console.log('after: ', o);
      // geometry has now been parsed
      this.payload = o.payload;
    }
  }

  public canUpgrade() {return false}

  public upgrade() {
    return this;
    //return new v2(this.payload).upgrade(); // trigger a recursive upgrade
  }

  public getPolygons() {
    return this.payload;
  }

  public toSave() {
    // TODO: use a replacer to force strictly only elements from PolygonData in the file
    return JSON.stringify(this);
  }
}

// class v2 extends v1 {
//
//   private notReallySecret = subtle.importKey('raw', str2ab('FIT3162'), 'hmac', false, ['sign', 'verify'])
//   public hmac;
//
//   constructor(polygons: PolygonData[]) {
//     super(polygons);
//     this.version = 2;
//     this.hmac = subtle.sign('hmac', this.notReallySecret, JSON.stringify(this.payload))
//     //this.hmac = createHmac('sha256', this.notReallySecret).update(JSON.stringify(this.payload)).digest('hex');
//   }
//
//   public integrityCheck() {
//     // Compute the HMAC, make sure it hasn't changed
//     return createHmac('sha256', this.notReallySecret).update(JSON.stringify(this.payload)).digest('hex') === this.hmac;
//   }
//
//   public canUpgrade() {
//     return false;
//   }
//
//   public upgrade() {
//     return this;
//   }
//
// }

class vLatest extends v1 {}

class Handler {
  private static readonly versions = [vLatest, v1];//, v2];

  public static getConstructor(version: number) {
    return this.versions[version]
  }

  public static prepareSave(pf: PolygonFile, shouldUpgrade: boolean = true) {
    if (shouldUpgrade) {
      pf = pf.upgrade();
    }
    if (pf.version) { /* you can add version checks here for different handlers */ }
    return pf.toSave();
  }

  public static prepareLoad(content: string) {
    console.log('prepareLoad content: ', content);
    const o = JSON.parse(content);
    console.log('prepareLoad object: ', o);
    const c = this.getConstructor(o.version) // get the constructor for this version
    console.log('prepareLoad constructor: ', c);
    const p = new c(content)
    console.log('polygonFile object: ', p)
    return p.getPolygons()
  }
}

export {Handler, vLatest};
