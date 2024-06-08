import mongoose from 'mongoose';
import { UserSchema } from './user.schema';

describe('User schema tests', () => {

    let conn: mongoose.Mongoose;

    beforeEach(async () => {
      conn = await mongoose.connect('mongodb://mongo:27017/mydb');
    });

    afterEach(async () => {
      await conn.disconnect();
    });

    it('create user', async () => {
        const UserModel = conn.model('User', UserSchema);
        const user = new UserModel({
            name: "claudio",
            password: "123@jodfdg",
            email: "claudio@email.com"
        });
        await user.save();
  
        const  userCreated = await UserModel.findById(user._id);
  
        expect(userCreated.name).toBe('claudio');
      });

});