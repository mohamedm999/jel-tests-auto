import { Page } from "@playwright/test";
import { ConnexionPage } from "../pages/connexion/page";
import { SignUpPage } from "../pages/signup/page";
import { ForgotPasswordPage } from "../pages/forgotPassword/page";
import { AskCivilityPage } from "../pages/signup/askCivility/page";
import { BirthPlacePage } from "../pages/signup/birthPlace/page";
import { GreetPage } from "../pages/signup/greet/page";
import { OptinsPage } from "../pages/signup/optins/page";
import { PostalAdressPage } from "../pages/signup/postalAdress/page";
import { AccountPage } from "../pages/account/page";
import { CommonPage } from "../pages/page";
import { HomePage } from "../pages/home/page";
import { PreventionPage } from "../pages/prevention/PreventionPage";
import { LimitsPage } from "./account/LimitsPage";
import { DocumentsPage } from "./account/DocumentsPage";
import { DepositPage } from "./account/DepositPage";
import { PromotionPage } from "./promotion/PromotionPage";
import { PokerPage } from "./poker/pokerPage";

export class PageManager {
  readonly connexionPage: ConnexionPage;
  readonly signUpPage: SignUpPage;
  readonly forgotPasswordPage: ForgotPasswordPage;
  readonly askCivilityPage: AskCivilityPage;
  readonly birthPlacePage: BirthPlacePage;
  readonly greetPage: GreetPage;
  readonly optinsPage: OptinsPage;
  readonly postalAdressPage: PostalAdressPage;
  readonly accountPage: AccountPage;
  readonly commonPage: CommonPage;
  readonly homePage: HomePage;
  readonly preventionPage: PreventionPage;
  readonly limitsPage: LimitsPage;
  readonly documentsPage: DocumentsPage;
  readonly depositPage: DepositPage;
  readonly promotionPage: PromotionPage;
  readonly pokerPage: PokerPage;

  constructor(page: Page) {
    this.connexionPage = new ConnexionPage(page);
    this.signUpPage = new SignUpPage(page);
    this.forgotPasswordPage = new ForgotPasswordPage(page);
    this.askCivilityPage = new AskCivilityPage(page);
    this.birthPlacePage = new BirthPlacePage(page);
    this.greetPage = new GreetPage(page);
    this.optinsPage = new OptinsPage(page);
    this.postalAdressPage = new PostalAdressPage(page);
    this.accountPage = new AccountPage(page);
    this.commonPage = new CommonPage(page);
    this.homePage = new HomePage(page);
    this.preventionPage = new PreventionPage(page);
    this.limitsPage = new LimitsPage(page);
    this.documentsPage = new DocumentsPage(page);
    this.depositPage = new DepositPage(page);
    this.promotionPage = new PromotionPage(page);
    this.pokerPage = new PokerPage(page);
  }
}
