import * as React from 'react';
import * as pnp from 'sp-pnp-js';
import Marquee from "react-fast-marquee";
import type { ISPList } from './INewsTickerProps';
import styles from './NewsTicker.module.scss';

interface ItemsListState {
  items: ISPList[];
}

export default class ItemsList extends React.Component<any, ItemsListState> {
  constructor(props: any) {
    super(props);
    this.state = {
      items: []
    };
  }

  componentDidMount() {
    this.getListData();
  }

  getListData(): void {
    pnp.sp.web.lists.getByTitle("News").items
      .select('Id', 'Title', 'Region', 'PublishDate', 'ExpiryDate', 'Price', 'Weight', 'AttachmentFiles', 'IsActive') // Include isActive in select
      .expand('AttachmentFiles')
      .filter("IsActive eq 1") // Filter only active items
      .getAll()
      .then((response: ISPList[]) => {
        console.log('This is response', response)
        this.setState({ items: response });

        // Process the data to find most repeated price with the same title
        this.findMostRepeatedPrice(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  formatDate(date: Date | string): string {
    if (typeof date === 'string') {
        // Assuming date is in ISO format, you may need to adjust accordingly
        date = new Date(date);
    }
    const day = (date.getDate() < 10 ? '0' : '') + date.getDate();
    const month = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

findMostRepeatedPrice(items: ISPList[]): void {
  const priceCounts: { [title: string]: { [price: number]: number } } = {}; // Object to store price counts for each title
  items.forEach(item => {
    if (!priceCounts[item.Title]) {
      priceCounts[item.Title] = {};
    }
    if (!priceCounts[item.Title][item.Price]) {
      priceCounts[item.Title][item.Price] = 0;
    }
    priceCounts[item.Title][item.Price]++;
  });

  // Find the most repeated price for each title
  const mostRepeatedPrices: { [title: string]: number } = {};
  for (const title in priceCounts) {
    const prices = priceCounts[title];
    let maxPrice: number | null = null;
    let maxCount = 0;
    for (const price in prices) {
      if (prices[price] > maxCount) {
        maxCount = prices[price];
        maxPrice = parseInt(price); // Convert price to number
      }
    }
    mostRepeatedPrices[title] = maxPrice !== null ? maxPrice : 0; // Assign 0 if maxPrice is null
  }

  console.log('Most repeated prices:', mostRepeatedPrices);
}

  

  renderList(): JSX.Element[] {
    return this.state.items.map((item: ISPList) => (
      <div key={item.Id} className={`row ${styles.itemsRow}`} style={{ paddingTop: '8px', display: 'flex', alignItems: 'center' }}>
        <div>
          {/* Check if AttachmentFiles is defined before accessing its properties */}
          {item.AttachmentFiles && item.AttachmentFiles.map((attachment, index) => (
            <span key={index} className='imgDiv'>
              <img src={attachment.ServerRelativeUrl} alt='logo' height='60px' />
            </span>
          ))}
        </div>
        <div style={{ marginLeft: '10px' }}>
          <span>{item.Title}</span>
          <br />
          <span>Rs. {item.Price}</span>
          <br />
          <span style={{ marginRight: '10px' }}>{this.formatDate(item.ExpiryDate)}</span>
          <span>{item.Region}</span>
        </div>
      </div>
    ));
  }

  render() {
    return (
      <Marquee pauseOnHover={true} speed={300}>
        <div className={`${styles.marqueeContainer}`}>
          <div id="NewsItems" className={`${styles.marqueeContent}`}>
            {this.renderList()}
          </div>
        </div>
      </Marquee>
    );
  }
}

