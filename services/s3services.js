const dotenv = require('dotenv');
dotenv.config();
const AWS = require('aws-sdk');

exports.uploadToS3 = (data, filename) => {
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const USER_KEY = process.env.AWS_ACCESS_KEY_ID;
    const USER_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;

    let s3bucket = new AWS.S3({
        accessKeyId: USER_KEY,
        secretAccessKey: USER_SECRET_KEY,
    })
    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }

    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3response) => {
            if (err) {
                console.log('Something went wrong', err);
                reject(err)
            } else {
                console.log('Success', s3response);
                resolve(s3response.Location);
            }
        })
    })
}