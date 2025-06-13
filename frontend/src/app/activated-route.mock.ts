import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

export const mockActivatedRoute = {
  paramMap: of({
    get: (key: string) => '1' // Simule un paramètre de route
  })
};
