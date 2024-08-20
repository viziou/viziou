import { PolygonData } from '../../../utils/types.tsx'
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

  constructor(polygons: string | PolygonData[]) {
    console.log("polygons: ", polygons)
    if (polygons instanceof Array ) {
      this.payload = polygons;
    }
    // otherwise we have a string
    // TODO: this is not type-safe since this has `any`, see https://stackoverflow.com/questions/38688822/how-to-parse-json-string-in-typescript
    else {
      const o = JSON.parse(JSON.stringify(polygons));
      this.payload = o.polygons;
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
    const o = JSON.parse(content);
    const c = this.getConstructor(o.version) // get the constructor for this version
    return new c(content).getPolygons()
  }
}

export {Handler, vLatest};
