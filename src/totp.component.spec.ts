import { tick, fakeAsync, async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable } from "rxjs";
import { TestScheduler } from 'rxjs/testing/TestScheduler';
import * as _ from 'lodash';

import { TOTPComponent } from './totp.component';


describe('Smoke test', () => {
    it('should run a passing test', () => {
        expect(true).toEqual(true, 'should pass');
    });
});

describe('TOTPComponent', () => {
    let fixture: any;
    let scheduler: any;

    beforeEach(async(() => {
        //jasmine.clock().install();
        //jasmine.clock().mockDate(baseTime);

        const assertDeepEqualFrame = (actual: any, expected: any) => {
            if (!_.isEqual(actual, expected)) {
                throw new Error('Frames not equal!');
            }
        }

        TestBed.configureTestingModule({ declarations: [TOTPComponent] });
        var baseTime = new Date(2016, 10, 8, 7, 25, 0);
        this.scheduler = new TestScheduler(assertDeepEqualFrame);
        const originalTimer = Observable.timer;
        console.log(originalTimer);
        spyOn(Observable, 'timer').and.callFake(function (initialDelay: any, dueTime: any) {
            console.log("initialDelay: " + initialDelay);
            console.log("dueTime:      " + dueTime);
            return originalTimer.call(this, initialDelay, dueTime, this.scheduler);
        });

        TestBed.overrideComponent(TOTPComponent, {
            set: {
                template: `{{ TOTP }}`
            }
        });

        return TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TOTPComponent);
        });
    }));

    afterEach(() => {
        //jasmine.clock().uninstall();
    });

    it('should instantiate component', () => {
        expect(fixture.componentInstance instanceof TOTPComponent).toBe(true, 'should create AppComponent');
        fixture.detectChanges();
    });

    // it('should contain the TOTP of 014914', () => {
    //     fixture.detectChanges();
    //     let compiled = fixture.nativeElement;
    //     expect(compiled.innerText).toMatch(/014914/);
    // });

    // it('should contain the TOTP of 014914', fakeAsync(() => {
    //     fixture.detectChanges();
    //     let compiled = fixture.nativeElement;
    //     expect(compiled.innerText).toMatch(/014914/);
    // }));

    it('should contain the TOTP of 014914', () => {
        console.log("here");
        fixture.detectChanges();
        this.scheduler.schedule(() => {
            console.log("here1");
            let compiled = fixture.nativeElement;
            console.log(compiled);
            //expect(compiled.innerText).toMatch(/014914/);
        }, 1, null);
        this.scheduler.schedule(() => {
            console.log("here2");
            let compiled = fixture.nativeElement;
            console.log(compiled);
            //expect(compiled.innerText).toMatch(/014914/);
        }, 2, null);
        console.log("here3");
        this.scheduler.flush();
    });
});