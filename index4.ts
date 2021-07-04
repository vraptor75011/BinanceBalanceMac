import * as rawPortfolioConfig from './secrets.json';
import { IPortfolioConfig } from './src/models/portfolio/portfolio.interfaces';
import Portfolio from './src/models/portfolio/portfolio.model';

const portfolioConfig: IPortfolioConfig[] = rawPortfolioConfig;

const Portfolios: Portfolio[] = [];

portfolioConfig.forEach((config) => Portfolios.push(new Portfolio(config)));
