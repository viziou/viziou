import { PolygonData } from '../utils/types.tsx';
import { Handler, vLatest } from './ts/2D/PolygonFile.ts';

class Storage {

  public static save(polygons: PolygonData[], name: string) {
    const fileData = [Handler.prepareSave(new vLatest(polygons))]

    // this might be different on browser vs. electron
    const file = new File(fileData, name, { type: "text/plain", });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = name + '.viz'

    // simulate a click
    document.body.appendChild(a); // necessary for firefox?
    a.click();
  }

}

export { Storage };
