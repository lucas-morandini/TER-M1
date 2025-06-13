import { Component, Input, type OnInit } from "@angular/core"
import { Stores } from "../../../../stores/Stores"
import type { Bet } from "../../../../commons/Bet"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-bet-card",
  templateUrl: "./bet-card.component.html",
  standalone: true,
  imports: [CommonModule],
  providers: [Stores],
})
export class BetCardComponent implements OnInit {
  @Input() id!: number
  bet!: Bet

  constructor(private stores: Stores) {
    this.bet = stores.betStore.factory()
  }

  ngOnInit(): void {
    this.loadBet()
  }

  async loadBet(): Promise<void> {
    const betStore = this.stores.betStore
    try {
      this.bet = await betStore.findBetById(this.id)
      if (!this.bet) {
        this.bet = betStore.factory()
      }
    } catch (error) {
      this.bet = betStore.factory()
    }
  }
}
