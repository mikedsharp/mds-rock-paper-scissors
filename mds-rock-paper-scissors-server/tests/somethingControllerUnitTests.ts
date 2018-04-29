import { expect } from 'chai';
import 'mocha';
import {MyService} from '../server/services/MyService';

describe('MyService', () => {
    describe('MyService.getSomething()', () => {
        it('Should return with "this is something"', async () => {
            const result = await MyService.getSomething();
            expect(result).equals("heres something...", "message is incorrect");
        });
    });
});