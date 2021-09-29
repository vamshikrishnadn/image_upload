const UploadModel = require('../model/schema');
const fs = require('fs');

exports.home = async (req, res) => {
  const all_images = await UploadModel.find();
  res.render('main', { images: all_images });
};

exports.uploads = (req, res, next) => {
  const files = req.files;
  // console.log(req.files);

  if (!files) {
    const error = new Error('Please Choose files');
    error.httpStatusCode = 400;
    return next(error);
  }

  // convert images into base64 encoding
  let imgArray = files.map(file => {
    let img = fs.readFileSync(file.path);
    return (encode_image = img.toString('base64'));
  });

  let result = imgArray.map((src, index) => {
    let finalImg = {
      filename: files[index].originalname,
      contentType: files[index].mimetype,
      imageBase64: src,
    };
    let newUpload = new UploadModel(finalImg);
    return newUpload
      .save()
      .then(() => {
        return {
          msg: `${files[index].originalname}'Image Uploaded Successfully...'`,
        };
      })
      .catch(error => {
        if (error) {
          if (error.name === 'MongoError' && error.code === 1100) {
            return Promise.reject({
              error: `Duplicate ${file[index].originalname} is already exist`,
            });
          }
          return Promise.reject({
            error:
              error.message ||
              `Cannot Upload ${files[index].originalname} Something Missing`,
          });
        }
      });
  });

  Promise.all(result)
    .then(msg => {
      res.redirect('/');
      // res.json(msg);
    })
    .catch(err => res.json(err));
};
