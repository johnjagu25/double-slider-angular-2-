import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { DoubleSliderComponent } from './slider-module/double-slider.component';
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        AppComponent,
                        DoubleSliderComponent
                    ],
                    imports: [
                        CommonModule
                    ],
                    exports: [
                        DoubleSliderComponent
                    ],
                    providers: [],
                    bootstrap: [AppComponent]
                },] },
    ];
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map