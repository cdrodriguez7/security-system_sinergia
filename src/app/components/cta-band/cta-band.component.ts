import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cta-band',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cta-band.component.html',
  styleUrls: ['./cta-band.component.scss']
})
export class CtaBandComponent {

  isExpanded: boolean = false;
  showDiscordModal: boolean = false;

  // 🔧 Reemplaza con tu link real de invitación de Discord
  discordInviteUrl: string = 'https://discord.gg/gckSbDtYX8';

  constructor(private router: Router) {}

  expand(): void {
    this.isExpanded = true;
  }

  collapse(): void {
    this.isExpanded = false;
  }

  goToContact(): void {
    this.router.navigate(['/contacto']);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.collapse();
  }

  openDiscord(): void {
    this.showDiscordModal = true;
    this.collapse();
  }

  closeDiscord(): void {
    this.showDiscordModal = false;
  }
}