import fs from "fs";
import path from "path";
export const deleteFile = async (fileName) => {
  try {
    let deletedFile = false;
    const filePath = path.join(process.env.DEST_FILES, fileName);

    await fs.stat(filePath, (err, stats) => {
      if (!stats) {
        deletedFile = false;
      } else if (!err)
        fs.unlink(filePath, (err, stats) => {
          deletedFile = true;
        });
    });
    return deletedFile;
  } catch (e) {
    return false;
  }
};
