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
    document.body.removeChild(a); // let's not overflow the page
  }

  public static async load() {
    const u = document.createElement('input');
    u.type = 'file';
    u.style.display = 'none';
    u.accept = '.viz'
    u.multiple = false; // TODO feat: merge multiple .viz files?

    // add event listeners
    const cl = new Promise((resolve) => {
      u.addEventListener('cancel', resolve, false);
    })

    const ch = new Promise((resolve) => {
      u.addEventListener('change', resolve, false);
    })

    // simulate a click
    document.body.appendChild(u);
    u.click();

    // block until one of these resolves
    await Promise.any([cl, ch]);

    // if the user sent a file then it's inside the 'u' HTML element
    // TODO feat: handle merging multiple .viz files!
    if (u.files && u.files.length === 1) {
      console.log('User requested file upload ', u.files[0]);
      document.body.removeChild(u); // cleanup
      return u.files[0];
    }

    // TODO: two removeChild calls is dirty

    console.log("User cancelled file upload.")
    document.body.removeChild(u); // cleanup
    return null;
  }
}

export { Storage };
