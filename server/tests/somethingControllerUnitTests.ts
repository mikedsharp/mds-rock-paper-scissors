import { expect } from 'chai';
import 'mocha';
import {SomethingService} from '../src/something/services/SomethingService';

describe('MyService', () => {
    describe('MyService.getSomething()', () => {
        it('Should return with "this is something"', async () => {
            const result = await SomethingService.getSomething();
            expect(result).equals("heres something...", "message is incorrect");
        });
    });
});