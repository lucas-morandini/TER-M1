import { User } from "../commons/User";
import { Store } from "./Store";


export class UserStore extends Store<User> {

  async hasSufficientFunds(id: number, amount: number): Promise<boolean> {
    try {
      const user = await this.findById(id);
      return user.solde >= amount;
    } catch (error) {
      console.error(`Erreur lors de la vérification des fonds pour l'utilisateur ${id}:`, error);
      return false;
    }
  }
  
  async updateUserBalance(id: any, solde: number): Promise<User> {
    const url = `/api/${this.single}/update-balance/${id}`;
    const response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify({ solde }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Error updating balance for user with id ${id}`);
    }

    return response.json();
  }

  protected single: string = 'user';
  protected multiple: string = 'users';

  async findById(id: number): Promise<User> {
    const url = `/api/${this.single}/${id}`;
    const token = localStorage.getItem("access_token");
    const response = await fetch(url, {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
      },
    });
    return response.json();
  }

  async create(user: User): Promise<User> {
    const url = `/api/${this.single}/create`;
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  async update(user: User): Promise<User> {
    const url = `/api/${this.single}/update/${user.id}`;
    const response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  async delete(id: number): Promise<void> {
    const url = `/api/${this.single}/delete/${id}`;
    await fetch(url, { method: 'DELETE' });
  }

  async findAll(): Promise<User[]> {
    const url = `/api/${this.multiple}/`;
    const response = await fetch(url);
    return response.json();
  }

  async connect(email: string, password: string): Promise<{access_token: string; user: User}> {
    const url = `/api/${this.single}/connect`;
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    if(response.status === 404)
    {
      throw new Error('User not found');
    }
    return response.json();
  }

  async register(
    username: string,
    email: string,
    password: string,
    birth_date: Date,
    tel: string,
    sex: string,
    name: string,
    first_name: string
  ): Promise<{ access_token: string; user: User }> {
    const newUser = new User(
      0, // ID will be assigned by the server
      new Date(),
      new Date(),
      username,
      email,
      password,
      birth_date,
      tel,
      sex,
      name,
      first_name,
      0
    );

    const url = `/api/${this.single}/register`;
    const response = await fetch(url, {
      method: 'POST',
      body: newUser.toJSON(),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Error registering user');
    }

    return response.json();
  }

  factory(): User {
    return new User(0,new Date(),new Date(),"N/A","N/A","N/A",new Date(),"N/A","N/A","N/A","N/A",0);
  }

  async resetPassword(token: string, password: string): Promise<any> {
    const url = `/api/${this.single}/reset-password`;
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ token, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  async lostPassword(email: string): Promise<any> {
    const url = `/api/${this.single}/forgot-password`;
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }

  async getBetsByUserId(userId: number): Promise<number[]> {
    const url = `/api/${this.single}/${userId}/bets`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching bets for user with id ${userId}`);
    }
    return response.json();
  }

  async isPaymentValidate(hash: string): Promise<boolean> {
    const url = `/api/${this.single}/payment/validation/${hash}`;
    const token = localStorage.getItem("access_token");
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    if (!response.ok) {
      if (response.status === 400) {
        return false;
      }
      throw new Error(`Error validating payment with hash ${hash}`);
    }
    return response.json();

     
  }   


}
