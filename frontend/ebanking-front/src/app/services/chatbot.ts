import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {

  constructor(private http: HttpClient) {}

  ask(question: string): Observable<{ answer: string }> {
    return this.http.post<{ answer: string }>(
      `${environment.backendHost}/api/chatbot/ask`,
      { question }
    );
  }
}
