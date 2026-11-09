import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-routine-icon',
  standalone: true,
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      @switch (name) {
        @case ('prayers') {
          <path d="M3 19h18M5 19a7 7 0 0 1 14 0M12 3v2m-7.36.64 1.42 1.42m12.02-1.42-1.42 1.42M2 12h2m16 0h2" />
        }
        @case ('sunnah') {
          <path d="M8 4v6m4-7v7m4-5v5m3 3-1 5a3 3 0 0 1-3 2h-3a4 4 0 0 1-3-1l-4-4a2 2 0 0 1 3-3l3 2V3a2 2 0 0 1 4 0v2a2 2 0 0 1 4 0v5a3 3 0 0 1-3 3z" />
        }
        @case ('qiyam') {
          <path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z" /><path d="m16.5 4 .7 1.8L19 6.5l-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" />
        }
        @case ('tasbeeh') {
          <circle cx="12" cy="12" r="7.5" /><circle cx="12" cy="4.5" r="1" fill="currentColor" stroke="none" /><circle cx="19.5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="19.5" r="1" fill="currentColor" stroke="none" /><circle cx="4.5" cy="12" r="1" fill="currentColor" stroke="none" /><path d="M12 9v3l2 1.5" />
        }
        @case ('water') {
          <path d="M12 2.8S5.8 10 5.8 14.7a6.2 6.2 0 0 0 12.4 0C18.2 10 12 2.8 12 2.8Z" /><path d="M9.3 15.2a2.8 2.8 0 0 0 2.8 2.8" />
        }
        @case ('morning') {
          <circle cx="12" cy="13" r="4" /><path d="M12 2v2m0 18v-2M4.2 4.2l1.4 1.4m12.8 12.8 1.4 1.4M2 13h2m16 0h2M4.2 21.8l1.4-1.4M18.4 5.6l1.4-1.4" />
        }
        @case ('evening') {
          <path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z" /><path d="m17.5 3 .5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3-1.3-.5 1.3-.5z" />
        }
        @case ('quran') {
          <path d="M12 6.5C9.5 4.8 6 4.6 3 5.5v13c3-.9 6.5-.7 9 1 2.5-1.7 6-1.9 9-1v-13c-3-.9-6.5-.7-9 1Z" /><path d="M12 6.5v13M6 9h3m-3 3h3m6-3h3m-3 3h3" />
        }
        @default {
          <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9z" />
        }
      }
    </svg>
  `,
  styles: [`:host{display:inline-flex;width:20px;height:20px;align-items:center;justify-content:center;flex:0 0 auto}:host svg{width:100%;height:100%;display:block}`],
})
export class RoutineIconComponent {
  @Input() name = '';
}
