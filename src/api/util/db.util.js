const { ObjectId, MongoClient } = require('mongodb');

class AppDbUtil {

    static connectionString = process.env['MONGODB_CONNETION_STRING'];

    static async getMongoDbClient() {
        return await MongoClient.connect(
            this.connectionString,
            { useNewUrlParser: true, useUnifiedTopology: true });
    }

    static async getAllNotes(filter = {}, limit = 10, skip = 0) {
        const client = await AppDbUtil.getMongoDbClient();
        const collection = client.db('notesapp').collection('notes');
        return await collection.find(filter, { skip: skip, limit: limit }).toArray();
    }

    static async saveNote(document) {
        const client = await AppDbUtil.getMongoDbClient();
        const collection = client.db('notesapp').collection('notes');
        return await collection.insertOne(document);
    }

    static async updateNote(noteId, documentPartial) {
        const client = await AppDbUtil.getMongoDbClient();
        const collection = client.db('notesapp').collection('notes');
        return await collection.updateOne({ _id: ObjectId(noteId) }, { $set: documentPartial });
    }

    static async deleteNote(noteId) {
        const client = await AppDbUtil.getMongoDbClient();
        const collection = client.db('notesapp').collection('notes');
        return await collection.deleteOne({ _id: ObjectId(noteId) });
    }

}

module.exports = AppDbUtil;
