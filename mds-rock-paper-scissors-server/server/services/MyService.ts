import axios from 'axios';

export abstract class MyService {
    public static getSomething() {
        return axios.get('http://google.com')
                    .then(() => {
                        return 'here is something...';
                    });
    }
}