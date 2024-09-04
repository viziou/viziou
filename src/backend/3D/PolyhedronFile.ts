import { PolyhedronData } from '../../utils/types.tsx'
import { BoxGeometry, BufferGeometryLoader } from 'three'
//import { createHmac } from 'crypto';
//const subtle = window.crypto.subtle;
//import { str2ab } from '../../../utils/strings.ts'

interface PolyhedronFile {

  readonly version: number;
  readonly dimension: number;
  readonly payload: object;

  // whether the file is upgradable. can include contextual information through context
  canUpgrade(context?: object): boolean;
  // upgrade to the next version. can again provide contextual information through an argument
  upgrade(context?: object): PolyhedronFile;

  getPolyhedra(): PolyhedronData[];

  toSave(): string;
}

class v1 implements PolyhedronFile {
  version = 1;
  dimension = 3;
  payload: PolyhedronData[];

  // TODO: can you overload a constructor?
  constructor(polyhedra: string | PolyhedronData[]) {
    console.log("polyhedra: ", polyhedra)
    if (polyhedra instanceof Array ) {
      console.log('found an array')
      this.payload = polyhedra;
    }
    // otherwise we have a string
    // TODO: this is not type-safe since this has `any`, see https://stackoverflow.com/questions/38688822/how-to-parse-json-string-in-typescript
    else {
      console.log('found a string');
      const o = JSON.parse(polyhedra);
      // we're restoring a save, and so need to recreate BufferGeometry instances
      console.log('before:', o);
       const geometryLoader = new BufferGeometryLoader();
       o.payload.map((polyhedra: PolyhedronData) => {
         if (polyhedra.geometry.type === 'BoxGeometry') {
           // have to recast since box geometry is special
           console.log('box geometry found', polyhedra.geometry)
           const g = polyhedra.geometry as unknown as {width: number, height: number, depth: number};
           polyhedra.geometry = new BoxGeometry(g.width, g.height, g.depth);
         }
         else {
           polyhedra.geometry = geometryLoader.parse(polyhedra.geometry);
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

  public getPolyhedra() {
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

  public static prepareSave(pf: PolyhedronFile, shouldUpgrade: boolean = true) {
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
    console.log('polyhedronFile object: ', p)
    return p.getPolyhedra()
  }
}

export {Handler, vLatest};
