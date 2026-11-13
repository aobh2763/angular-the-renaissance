import { Component, signal, computed, linkedSignal } from '@angular/core';
import { countries } from '../data/countries';
import { Country } from '../model/country.interface';

@Component({
  selector: 'app-country-currency-selector',
  standalone: true,
  imports: [],
  templateUrl: './country-currency-selector.component.html',
  styleUrl: './country-currency-selector.component.css',
})
export class CountryCurrencySelectorComponent {
  
  countries = signal(countries);
  selectedCountry = signal(this.countries()[0]);
  availableCurrencies = computed(
    () => this.selectedCountry().acceptedCurrencies,
  );


  selectedCurrency = linkedSignal({
    source: () => this.selectedCountry(),
    computation: (country, previous) => {
      const previousCurrency = previous?.value as string | undefined;
      if (
        previousCurrency &&
        country.acceptedCurrencies.includes(previousCurrency)
      ) {
        return previousCurrency;
      }
      return country.defaultCurrency;
    },
  });

  
  onCountryChange(event: Event) {
    const countryName = (event.target as HTMLSelectElement).value;

    const country = this.countries().find((c) => c.name === countryName);

    if (country) {
      this.selectedCountry.set(country);
    }
  }


  onCurrencyChange(event: Event) {
    const currency = (event.target as HTMLSelectElement).value;

    this.selectedCurrency.set(currency);
  }
}
