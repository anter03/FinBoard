import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckResultLogService } from '../../services/check-result-log-service'; 
import { CheckResultLog } from '../../models/check-result-log'; 

@Component({
  selector: 'app-message-center',
  templateUrl: './message-center.component.html',
  styleUrls: ['./message-center.component.css'],
  standalone: true,
  imports: [
    CommonModule, FormsModule
  ]
})
export class MessageCenterComponent implements OnInit {

  logs: CheckResultLog[] = [];
  filteredLogs: CheckResultLog[] = [];

  selectedValid: string = 'tutti';
  searchTerm: string = '';
  searchId: string = '';
  searchRuleDescription: string = '';
  dataInizio: string = '';
  dataFine: string = '';

  totalLogs: number = 0;
  validCount: number = 0;
  invalidCount: number = 0;

  validOptions = [
    { value: 'tutti', label: 'Tutti i risultati' },
    { value: 'true', label: 'Validi' },
    { value: 'false', label: 'Non Validi' }
  ];

  constructor(private logService: CheckResultLogService) { }

  ngOnInit(): void {
    this.loadLogsFromApi(); // ✅ carica da API, non mock
  }

  loadLogsFromApi(): void {
    this.logService.getAllLogs()
      .subscribe(logs => {
        this.logs = logs.map(log => ({
          ...log,
          timestamp: new Date(log.timestamp)
        }));
        this.updateCounters();
        this.applyFilters();
      });
  }

  applyFilters(): void {
    this.filteredLogs = this.logs.filter(log => {
      const matchValid = this.selectedValid === 'tutti' || 
                         log.valid.toString() === this.selectedValid;

      const matchId = !this.searchId || 
                      log.id.toString().includes(this.searchId);

      const matchRuleDescription = !this.searchRuleDescription || 
                                   log.ruleDescription.toLowerCase()
                                      .includes(this.searchRuleDescription.toLowerCase());

      const matchSearch = !this.searchTerm || 
                          (log.errorMessage?.toLowerCase() || '').includes(this.searchTerm.toLowerCase()) ||
                          (log.ruleText?.toLowerCase() || '').includes(this.searchTerm.toLowerCase()) ||
                          log.ruleId?.toString().includes(this.searchTerm);

      let matchData = true;
      if (this.dataInizio) {
        const startDate = new Date(this.dataInizio);
        matchData = matchData && log.timestamp >= startDate;
      }
      if (this.dataFine) {
        const endDate = new Date(this.dataFine);
        endDate.setHours(23, 59, 59, 999);
        matchData = matchData && log.timestamp <= endDate;
      }

      return matchValid && matchId && matchRuleDescription && matchSearch && matchData;
    });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.selectedValid = 'tutti';
    this.searchTerm = '';
    this.searchId = '';
    this.searchRuleDescription = '';
    this.dataInizio = '';
    this.dataFine = '';
    this.applyFilters();
  }

  deleteLog(logId: number): void {
    this.logs = this.logs.filter(l => l.id !== logId);
    this.updateCounters();
    this.applyFilters();
  }

  private updateCounters(): void {
    this.totalLogs = this.logs.length;
    this.validCount = this.logs.filter(l => l.valid).length;
    this.invalidCount = this.logs.filter(l => !l.valid).length;
  }

  getValidIcon(valid: boolean): string {
    return valid ? 'check-circle' : 'x-circle';
  }

  getValidClass(valid: boolean): string {
    return valid ? 'result-valid' : 'result-invalid';
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
}
