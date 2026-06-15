import 'zone.js';  // ← doit être le premier import — patche toutes les APIs async
import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app-module';

platformBrowser().bootstrapModule(AppModule, {
  
})
  .catch(err => console.error(err));
