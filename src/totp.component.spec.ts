import { TestBed} from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TOTPComponent } from './totp.component';


describe('Smoke test', () => {
    it('should run a passing test', () => {
        expect(true).toEqual(true, 'should pass');
    });
});

describe('TOTPComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({ declarations: [TOTPComponent] });
    });


    it('should instantiate component', () => {
        let fixture = TestBed.createComponent(TOTPComponent);
        expect(fixture.componentInstance instanceof TOTPComponent).toBe(true, 'should create AppComponent');
    });
});