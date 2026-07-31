import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="containerClass" class="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden">
      <div class="h-48 bg-gray-300 dark:bg-gray-700 w-full mb-4"></div>
      <div class="p-4 space-y-3">
        <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        <div class="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
        <div class="flex justify-between items-center pt-2">
          <div class="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
          <div class="h-8 bg-gray-300 dark:bg-gray-700 rounded-lg w-1/4"></div>
        </div>
      </div>
    </div>
  `
})
export class SkeletonLoaderComponent {
  @Input() containerClass: string = '';
}
