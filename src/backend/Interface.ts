import { PolygonData } from '../utils/types.tsx';
import { Handler, vLatest } from './ts/2D/PolygonFile.ts';

class Storage {

  public static save(polygons: PolygonData[], name: string) {
    // TODO: should probably not create the vLatest object here, should be prepareSave's responsibility
    const fileData = [Handler.prepareSave(new vLatest(polygons))] // this has to be an array of files

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
    u.accept = '.viz';
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
      const handle = u.files[0]; // 'u' is no longer part of the DOM but it's still in memory
      const content = await handle.text(); // get the text representation (UTF-8 only)
      console.log('Text representation: ', content)
      const pl = Handler.prepareLoad(content); // the PolygonData array in this file
      console.log('Object representation: ', pl)
      return pl
    }

    // TODO: two removeChild calls is dirty

    console.log("User cancelled file upload.")
    document.body.removeChild(u); // cleanup
    return null;
  }
}

export { Storage };
