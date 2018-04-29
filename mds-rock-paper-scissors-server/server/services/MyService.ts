import axios from 'axios';

export abstract class MyService {
    public static async getSomething() {
        const result = await axios.get('http://google.com');
        return 'heres something...';
    }
}