import * as rawApiConfig from './secrets.json';
import { IPortfolioApiConfig } from './src/models/portfolio/portfolio.interfaces';
import Portfolio from './src/models/portfolio/portfolio.model';

const globalApiConfig: IPortfolioApiConfig = rawApiConfig;

const MyPortfolio = new Portfolio(globalApiConfig);
console.log('INDEX', MyPortfolio.getBalance());
