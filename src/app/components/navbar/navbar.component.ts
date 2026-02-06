import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isScrolled = false;
  isMobileMenuOpen = false;
  activeDropdown: string | null = null;

  constructor(private router: Router) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.pageYOffset > 50;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleDropdown(menu: string) {
    this.activeDropdown = this.activeDropdown === menu ? null : menu;
  }

  closeDropdown() {
    this.activeDropdown = null;
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
    this.isMobileMenuOpen = false;
    this.closeDropdown();
  }

  scrollToSection(sectionId: string) {
    // Solo scroll si estamos en la home
    if (this.router.url === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        this.isMobileMenuOpen = false;
        this.closeDropdown();
      }
    } else {
      // Si no estamos en home, navegar a home y luego scroll
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      });
      this.isMobileMenuOpen = false;
      this.closeDropdown();
    }
  }
}
