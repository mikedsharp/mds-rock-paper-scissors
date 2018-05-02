import axios from 'axios';

export abstract class SomethingService {
    public static async getSomething() {
        const result = await axios.get('http://google.com');
        return 'heres something...';
    }
}