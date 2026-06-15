import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserDTO, UserManagement, CreateUserDTO } from '../../services/user-management';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {

  users: UserDTO[] = [];
  errorMessage  = '';
  successMessage = '';
  showCreateForm = false;

  createForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email:    new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(private userService: UserManagement, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => { this.users = data; this.cdr.detectChanges(); },
      error: ()    => { this.errorMessage = 'Impossible de charger les utilisateurs.'; this.cdr.detectChanges(); },
    });
  }

  hasRole(user: UserDTO, role: string): boolean {
    return user.roles.includes(role);
  }

  addAdmin(user: UserDTO): void {
    this.userService.addRole(user.id, 'ADMIN').subscribe({
      next: (updated) => { this.replaceUser(updated); this.cdr.detectChanges(); },
      error: ()       => { this.errorMessage = `Impossible d'ajouter le rôle ADMIN.`; this.cdr.detectChanges(); },
    });
  }

  removeAdmin(user: UserDTO): void {
    this.userService.removeRole(user.id, 'ADMIN').subscribe({
      next: (updated) => { this.replaceUser(updated); this.cdr.detectChanges(); },
      error: ()       => { this.errorMessage = `Impossible de retirer le rôle ADMIN.`; this.cdr.detectChanges(); },
    });
  }

  deleteUser(user: UserDTO): void {
    if (!confirm(`Supprimer l'utilisateur "${user.username}" ?`)) return;
    this.userService.deleteUser(user.id).subscribe({
      next: ()  => { this.users = this.users.filter(u => u.id !== user.id); this.cdr.detectChanges(); },
      error: () => { this.errorMessage = 'Impossible de supprimer cet utilisateur.'; this.cdr.detectChanges(); },
    });
  }

  submitCreate(): void {
    if (this.createForm.invalid) return;
    const dto: CreateUserDTO = this.createForm.value as CreateUserDTO;
    this.userService.createUser(dto).subscribe({
      next: (newUser) => {
        this.users.push(newUser);
        this.createForm.reset();
        this.showCreateForm = false;
        this.successMessage = `Utilisateur "${newUser.username}" créé.`;
        this.cdr.detectChanges();
        setTimeout(() => { this.successMessage = ''; this.cdr.detectChanges(); }, 3000);
      },
      error: () => { this.errorMessage = 'Erreur lors de la création.'; this.cdr.detectChanges(); },
    });
  }

  private replaceUser(updated: UserDTO): void {
    this.users = this.users.map(u => u.id === updated.id ? updated : u);
  }
}
