import { Test, TestingModule } from '@nestjs/testing';

describe('Always Right Test', () => {
    let app: TestingModule;

    beforeAll(async () => {
        app = await Test.createTestingModule({
            controllers: [],
            providers: [],
        }).compile();
    });

    it('should always pass', () => {
        expect(true).toBe(true);
    });
});