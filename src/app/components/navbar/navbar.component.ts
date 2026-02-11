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

  // Cerrar dropdown al hacer clic fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInsideDropdown = target.closest('.dropdown');
    
    if (!clickedInsideDropdown) {
      this.activeDropdown = null;
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleDropdown(menu: string, event: Event) {
    event.stopPropagation(); // Prevenir que el click se propague al document
    
    if (this.activeDropdown === menu) {
      this.activeDropdown = null; // Cerrar si ya está abierto
    } else {
      this.activeDropdown = menu; // Abrir el menú
    }
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