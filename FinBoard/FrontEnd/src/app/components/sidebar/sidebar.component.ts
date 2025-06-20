import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router'; // <--- Importa questo!


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [CommonModule,RouterModule],
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isExpanded: boolean = false;
  isPinned: boolean = false;
  isHovered: boolean = false;

  menuItems = [
    {
      icon: 'fas fa-home',
      label: 'Dashboard',
      route: '/dashboard',
      active: true
    },
    {
      icon: 'fas fa-chart-line',
      label: 'Analytics',
      route: '/analytics',
      active: false
    },
    {
      icon: 'fas fa-wallet',
      label: 'Portfolio',
      route: '/portfolio',
      active: false
    },
    {
      icon: 'fas fa-exchange-alt',
      label: 'Gestione Ordini',
      route: '/dashboard/ordermanagment',
      active: true
    },
    {
      icon: 'fas fa-bell',
      label: 'Notifiche',
      route: '/dashboard/messagecenter',
      active: true,
      badge: 3
    },
    {
      icon: 'fas fa-cog',
      label: 'Impostazioni',
      route: '/settings',
      active: false
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Carica lo stato pinnato dal localStorage
    const savedPinnedState = localStorage.getItem('sidebarPinned');
    if (savedPinnedState) {
      this.isPinned = JSON.parse(savedPinnedState);
      this.isExpanded = this.isPinned;
    }
  }

  onMouseEnter(): void {
    this.isHovered = true;
    if (!this.isPinned) {
      this.isExpanded = true;
    }
      this.updateBodyClass();

  }

  onMouseLeave(): void {
    this.isHovered = false;
    if (!this.isPinned) {
      this.isExpanded = false;
    }
        this.updateBodyClass();
  }

  togglePin(): void {
    this.isPinned = !this.isPinned;
    this.isExpanded = this.isPinned || this.isHovered;
    
    // Salva lo stato nel localStorage
    localStorage.setItem('sidebarPinned', JSON.stringify(this.isPinned));
  }

  selectMenuItem(item: any): void {
    // Deseleziona tutti gli elementi
    this.menuItems.forEach(menuItem => menuItem.active = false);
    // Seleziona l'elemento cliccato
    item.active = true;
    
    // Qui puoi aggiungere la logica di navigazione
    // this.router.navigate([item.route]);
  }

  get sidebarClass(): string {
    return `sidebar ${this.isExpanded ? 'expanded' : 'collapsed'} ${this.isPinned ? 'pinned' : ''}`;
  }

  private updateBodyClass() {
  if (this.isExpanded) {
    document.body.classList.add('sidebar-expanded');
    document.body.classList.remove('sidebar-collapsed');
  } else {
    document.body.classList.remove('sidebar-expanded');
    document.body.classList.add('sidebar-collapsed');
  }
}

}