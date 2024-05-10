import * as React from 'react';
import * as ReactDom from 'react-dom';
// import { Version } from '@microsoft/sp-core-library';
// import {
//   type IPropertyPaneConfiguration,
//   PropertyPaneTextField
// } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
// import { IReadonlyTheme } from '@microsoft/sp-component-base';
//import { sp } from "@pnp/sp";
import * as pnp from 'sp-pnp-js';


// import * as strings from 'NewsTickerWebPartStrings';
import NewsTicker from './components/NewsTicker';
import { ISPList } from './components/INewsTickerProps';

export interface INewsTickerWebPartProps {
  description: string;
}

export default class NewsTickerWebPart extends BaseClientSideWebPart<INewsTickerWebPartProps> {

 

  public render(): void {
    const element: React.ReactElement<ISPList> = React.createElement(
      NewsTicker,
      {
        
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {

    pnp.setup({
    
    spfxContext: this.context as any
    
    });
    
    return super.onInit();
    
    }
    
    }







