// const { Firestore } = require("@google-cloud/firestore");

// async function storeData(id, data) {
//   const db = new Firestore();

//   const predictCollection = db.collection("predictions");
//   await predictCollection.doc(id).set(data);
// }

// module.exports = storeData;

const mysql = require('mysql2/promise');
const { Storage } = require('@google-cloud/storage');

async function storeData(result, suggestion, imageFile) {
    // Konfigurasi untuk cloud storage
    const storage = new Storage({
        projectId: 'dermaone-424202',
        keyFilename: 'serviceaccountkey.json'
    });
    const bucketName = 'predictions-images';
    const bucket = storage.bucket(bucketName);

    // Upload gambar ke cloud storage dan dapatkan URL gambar
    const imageUrl = await uploadFile(bucket, imageFile);

    // Buat koneksi ke database Cloud SQL
    const connection = await mysql.createConnection({
        host: '34.101.181.220',
        user: 'root',
        password: 'Allahuakbar1',
        database: 'cancer'
    });

    // Siapkan kueri SQL untuk memasukkan data ke dalam tabel predictions
    const query = 'INSERT INTO predictions (result, suggestion, image, createdAt) VALUES (?, ?, ?, NOW())';

    // Eksekusi kueri SQL dengan menyertakan result, suggestion, URL gambar, dan timestamp
    await connection.execute(query, [result, suggestion, imageUrl]);

    // Tutup koneksi
    await connection.end();
}

async function uploadFile(bucket, imageFile) {
    const destination = `images/${Date.now()}_${imageFile.originalname}`;
    const file = bucket.file(destination);

    await file.save(imageFile.buffer, {
        gzip: true,
        metadata: {
            contentType: imageFile.mimetype
        }
    });

    console.log(`${imageFile.originalname} uploaded to ${bucket.name}/${destination}`);

    return `https://storage.googleapis.com/${bucket.name}/${destination}`;
}

module.exports = storeData;

