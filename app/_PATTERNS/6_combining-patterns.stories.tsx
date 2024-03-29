import { storiesOf } from '@storybook/react';
import { H1, Column, Row, LayoutBgColor } from 'components';
import { renderers } from 'components/atoms/fonts/markdown';
import React, { Component, createContext, SFC, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { ExampleWrapper } from './shared-components';

const intro = `
## The Feature - Data Filters
`;

const intro2 = `
## Component Breakdown
  * Brand Filter
  * Market Filter
  * Search or Hierarchy Filter
  * Horizontal Rule and Horizontal Rule w/ OR text

## First Approach (Novice React Dev)
  1. Build Monolithic class component with local state to manage values selected in dropdowns, text
  inputs, and checkboxes
  2. Split \`render\` method into smaller render methods on class


### Step 1 - Monolithic Class
  \`\`\`tsx
  class Filters extends Component<{}, IFiltersState> {
    state = {
      isSearchActive: true,
      searchTerm: '',
      selectedBrand: 'Brand 1',
      selectedMarkets: ['Market 1'],
      selectedHierarchy: 'Legacy',
    };
  
    toggleActiveSearch = (...args) => /* setState({...}) logic here */;
    updateSearch = (...args) => /* setState({...}) logic here */;
    updateBrand = (...args) => /* setState({...}) logic here */;
    updateHierarchy = (...args) => /* setState({...}) logic here */;
    updateMarket = (...args) => /* setState({...}) logic here */;
  
    render() {
      return (
        <Column bgColor={LayoutBgColor.GREY}>
          {/* Render Brand Here */}
          <Hr />
          {/* Render Market Here */}
          <Hr />
          {/* Render Search or Hierarchy Here */}
        </Column>
      );
    }
  }
  \`\`\`

### Step 2 - Separate render methods
  \`\`\`tsx
  renderBrand = () => (
    <>
      <HeadingFont>Brand</HeadingFont>
      <select value={this.state.selectedBrand} onChange={this.updateBrand}>
        {brandOptions.map(brand => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>
    </>
  );

  {...}

  render() {
    return (
      <Column bgColor={LayoutBgColor.GREY}>
        {this.renderBrand()}
        <Hr />
        {this.renderMarket()}
        <Hr />
        {this.renderSearchOrHierarchy()}
      </Column>
    );
  }
  \`\`\`

## Approach Retro
**Pros**
  * Single file makes it relatively easy to find bugs
  * Business logic is centralized and easy to follow
  * Generally quick to create

**Cons**
  * Monolithic files are rigid and rarely reusable
  * Ongoing maintenance of business logic, structure, and styles becomes increasingly difficult as
  more hands are added to the pot

## Second Approach (Advanced React Dev)
  1. Build small, stand-alone, reusable components designed around user interactions
  2. Use Hooks + Context to store state and "hide" automatic integrations
  3. Use Named Slots to structure UI
  4. Use Children as an Array to add \`<Hr />\` between each child
  5. Combine patterns & components into finished product

### Step 1 - Small, stand-alone, reusable components (Dropdown Filter)
\`\`\`tsx
const DropdownFilter: SFC<IMultiOptionFilter> = props => {
  return (
    <FilterContext.Consumer>
      {({ filterData, setFilterForKey }) => {
        const selectedOption = filterData[props.title] || '';
        const setDropdownFilter = (e: React.ChangeEvent<HTMLSelectElement>) =>
          setFilterForKey(props.title, e.target.value);
        return (
          <>
            <HeadingFont>{props.title}</HeadingFont>
            <select
              value={selectedOption}
              onChange={setDropdownFilter}
              disabled={props.disabled}
            >
              {props.options.map(o => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </>
        );
      }}
    </FilterContext.Consumer>
  );
};
\`\`\`

### Step 2 - Hooks + Context
\`\`\`tsx
type TSetFilterCallback = (key: string, value: string | string[]) => void;
interface IFilterData {
  [key: string]: string | string[];
}
interface IFilterContext {
  filterData: IFilterData;
  setFilterForKey: TSetFilterCallback;
  [key: string]: IFilterData | TSetFilterCallback;
}
const initialContext = {
  filterData: {},
  setFilterForKey: (): void => null,
};
const FilterContext = createContext<IFilterContext>(initialContext);
\`\`\`

### Step 3 - Named Slots
\`\`\`tsx
interface IOrFilter {
  children: {
    top: (disabled: boolean) => JSX.Element;
    bottom: (disabled: boolean) => JSX.Element;
  };
}

const OrFilter: SFC<IOrFilter> = props => {
  const { top, bottom } = props.children;
  const [activeSection, setActiveSection] = useState('top');
  const getOnClick = (section: string) => () => setActiveSection(section);

  return (
    <>
      <ActiveFilter onClick={getOnClick('top')} isActive={activeSection === 'top'}>
        {top(activeSection === 'bottom')}
      </ActiveFilter>
      <OrDivider />
      <ActiveFilter
        onClick={getOnClick('bottom')}
        isActive={activeSection === 'bottom'}
      >
        {bottom(activeSection === 'top')}
      </ActiveFilter>
    </>
  );
};
\`\`\`

### Step 4 - Children as an Array
\`\`\`tsx
interface IColumnLayout {
  children: JSX.Element[];
}

const ColumnLayout: SFC<IColumnLayout> = props => (
  <Column bgColor={LayoutBgColor.GREY}>
    {React.Children.toArray(props.children).map(
      (child: JSX.Element, index: number) =>
        index < props.children.length - 1 ? (
          <React.Fragment key={child.key}>
            {child}
            <Hr />
          </React.Fragment>
        ) : (
          child
        ),
    )}
  </Column>
);
\`\`\`

### Step 5 - Combine Everything
\`\`\`tsx
const AdvancedFilters: SFC<{}> = () => {
  const [filtersState, setFiltersState] = useState<IFilterContext>(initialContext);

  const setFilter = (key: string, value: string | string[]) =>
    setFiltersState({
      ...filtersState,
      filterData: { ...filtersState.filterData, [key]: value },
    });

  const filterContextValue = {
    ...filtersState,
    setFilterForKey: setFilter,
  };
  return (
    <FilterContext.Provider value={filterContextValue}>
      <ColumnLayout>
        <DropdownFilter title="Brand" options={brandOptions} />
        <CheckboxFilter title="Market" options={marketOptions} />
        <OrFilter>
          {{
            top: disabled => (
              <TextInputFilter
                title="Search"
                disabled={disabled}
              />
            ),
            bottom: disabled => (
              <DropdownFilter
                title="Hierarchy"
                options={hierarchyOptions}
                disabled={disabled}
              />
            ),
          }}
        </OrFilter>
      </ColumnLayout>
    </FilterContext.Provider>
  );
};
\`\`\`

## Approach Retro
**Pros**
  * Smaller components promote reuse across oher features
  * Automatic features accelerate future development
  * Single responsibility separates design from function; narrowing scope of code where bugs occur

**Cons**
  * Initial architecture can be unclear; requiring multiple iterations
  * Implementation details can be opaque; resulting in a slower, more difficult onboarding
  experience

## Side by Side Demo (First | Second)
`;

// #region Shared Code
const DemoRow = styled(Row)`
  justify-content: space-between;
  width: 100%;
`;

const Hr = styled.hr`
  border-top: 1px solid ${props => props.theme.colors.black};
  border-style: solid;
  margin: 16px 8px;
`;

const CheckboxWithLabel = styled.div`
  padding-right: 16px;
`;

const FullWidthRow = styled(Row)`
  width: 100%;
  hr {
    flex: 1;
  }
`;

interface IActiveFilter {
  isActive: boolean;
  onClick: () => void;
}

const FilterWrapper = styled.div<IActiveFilter>`
  width: 100%;
  input {
    width: 100%;
  }
  select {
    width: 100%;
  }

  ${props =>
    !props.isActive &&
    `
    opacity: 0.5;
    &:hover {
      cursor: pointer;
    }
  `}
`;

const brandOptions = ['Brand 1', 'Brand 2', 'Brand 3'];
const marketOptions = ['Market 1', 'Market 2', 'Market 3'];
const hierarchyOptions = ['Legacy', 'Universal'];
// #endregion Shared Code
// #region Initial Filters Architecture
interface IFiltersState {
  isSearchActive: boolean;
  searchTerm: string;
  selectedBrand: string;
  selectedMarkets: string[];
  selectedHierarchy: string;
}

class Filters extends Component<{}, IFiltersState> {
  state = {
    isSearchActive: true,
    searchTerm: '',
    selectedBrand: 'Brand 1',
    selectedMarkets: ['Market 1'],
    selectedHierarchy: 'Legacy',
  };

  toggleActiveSearch = () =>
    this.setState({ isSearchActive: !this.state.isSearchActive });

  updateSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ searchTerm: e.target.value });

  updateBrand = (e: React.ChangeEvent<HTMLSelectElement>) =>
    this.setState({ selectedBrand: e.target.value });

  updateHierarchy = (e: React.ChangeEvent<HTMLSelectElement>) =>
    this.setState({ selectedHierarchy: e.target.value });

  updateMarket = (e: React.ChangeEvent<HTMLInputElement>) => {
    const market = e.target.value;
    if (this.state.selectedMarkets.includes(market)) {
      this.setState({
        selectedMarkets: this.state.selectedMarkets.filter(m => m !== market),
      });
    } else {
      this.setState({
        selectedMarkets: this.state.selectedMarkets.concat(market),
      });
    }
  };

  renderBrand = () => (
    <>
      <H1>Brand</H1>
      <select value={this.state.selectedBrand} onChange={this.updateBrand}>
        {brandOptions.map(brand => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>
    </>
  );

  renderMarket = () => (
    <>
      <H1>Market</H1>
      <Row>
        {marketOptions.map(market => (
          <CheckboxWithLabel key={market}>
            <input
              type="checkbox"
              value={market}
              onChange={this.updateMarket}
              checked={this.state.selectedMarkets.includes(market)}
            />
            <label htmlFor={market}>{market}</label>
          </CheckboxWithLabel>
        ))}
      </Row>
    </>
  );

  renderSearchOrHierarchy = () => {
    const nullFunc = (): void => null;
    return (
      <>
        <ActiveFilter
          isActive={this.state.isSearchActive}
          onClick={!this.state.isSearchActive ? this.toggleActiveSearch : nullFunc}
        >
          <H1>Search</H1>
          <input
            type="text"
            value={this.state.searchTerm}
            placeholder="Enter search term"
            onChange={this.updateSearch}
            disabled={!this.state.isSearchActive}
          />
        </ActiveFilter>
        <FullWidthRow>
          <Hr />
          OR
          <Hr />
        </FullWidthRow>
        <ActiveFilter
          isActive={!this.state.isSearchActive}
          onClick={this.state.isSearchActive ? this.toggleActiveSearch : nullFunc}
        >
          <H1>Hierarchy</H1>
          <select
            value={this.state.selectedHierarchy}
            onChange={this.updateHierarchy}
            disabled={this.state.isSearchActive}
          >
            {hierarchyOptions.map(hierarchy => (
              <option key={hierarchy} value={hierarchy}>
                {hierarchy}
              </option>
            ))}
          </select>
        </ActiveFilter>
      </>
    );
  };

  render() {
    return (
      <Column bgColor={LayoutBgColor.GREY} padding={16}>
        {this.renderBrand()}
        <Hr />
        {this.renderMarket()}
        <Hr />
        {this.renderSearchOrHierarchy()}
      </Column>
    );
  }
}
// #endregion Initial Filters Architecture
// #region Advanced Filters Architecture
interface IFilter {
  title: string;
  disabled?: boolean;
}

interface IMultiOptionFilter extends IFilter {
  options: string[];
}

interface IAccordionWithComponentProps {
  title: string;
  children: JSX.Element;
}

const AccordionWithComponent: SFC<IAccordionWithComponentProps> = props => (
  <>
    <H1>{props.title}</H1>
    {props.children}
  </>
);

interface IDropdownProps {
  onChange: (id: string, value: string) => void;
  value: string;
  disabled?: boolean;
  id: string;
  options: string[];
}
const Dropdown: SFC<IDropdownProps> = props => {
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    props.onChange(props.id, e.target.value);
  return (
    <select value={props.value} onChange={onChange} disabled={props.disabled}>
      {props.options.map(o => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
};

const DropdownFilter: SFC<IMultiOptionFilter> = props => {
  return (
    <FilterContext.Consumer>
      {({ filterData, setFilterForKey }) => {
        const selectedOption = (filterData[props.title] as string) || '';

        return (
          <AccordionWithComponent title={props.title}>
            <Dropdown
              value={selectedOption}
              disabled={props.disabled}
              id={props.title}
              options={props.options}
              onChange={setFilterForKey}
            />
          </AccordionWithComponent>
        );
      }}
    </FilterContext.Consumer>
  );
};

const CheckboxFilter: SFC<IMultiOptionFilter> = props => (
  <FilterContext.Consumer>
    {({ filterData, setFilterForKey }) => {
      const checkboxSelections = (filterData[props.title] || []) as string[];
      const setCheckboxSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (checkboxSelections.includes(value)) {
          setFilterForKey(props.title, checkboxSelections.filter(f => f !== value));
        } else {
          setFilterForKey(props.title, checkboxSelections.concat(value));
        }
      };
      return (
        <AccordionWithComponent title={props.title}>
          <Row>
            {props.options.map(o => (
              <CheckboxWithLabel key={o}>
                <input
                  type="checkbox"
                  value={o}
                  onChange={setCheckboxSelection}
                  checked={checkboxSelections.includes(o)}
                />
                <label htmlFor={o}>{o}</label>
              </CheckboxWithLabel>
            ))}
          </Row>
        </AccordionWithComponent>
      );
    }}
  </FilterContext.Consumer>
);

const TextInputFilter: SFC<IFilter> = props => (
  <FilterContext.Consumer>
    {({ filterData, setFilterForKey }) => {
      const textValue = filterData[props.title] || '';
      const setTextValue = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFilterForKey(props.title, e.target.value);
      return (
        <AccordionWithComponent title={props.title}>
          <input
            type="text"
            value={textValue}
            placeholder="Enter search term"
            onChange={setTextValue}
            disabled={props.disabled}
          />
        </AccordionWithComponent>
      );
    }}
  </FilterContext.Consumer>
);

const OrDivider: SFC<{}> = () => (
  <FullWidthRow>
    <Hr />
    OR
    <Hr />
  </FullWidthRow>
);

const ActiveFilter: SFC<IActiveFilter> = props => <FilterWrapper {...props} />;

interface IOrFilter {
  children: {
    top: (disabled: boolean) => JSX.Element;
    bottom: (disabled: boolean) => JSX.Element;
  };
}

const OrFilter: SFC<IOrFilter> = props => {
  const { top, bottom } = props.children;
  const [activeSection, setActiveSection] = useState('top');
  const getOnClick = (section: string) => () => setActiveSection(section);

  return (
    <>
      <ActiveFilter onClick={getOnClick('top')} isActive={activeSection === 'top'}>
        {top(activeSection === 'bottom')}
      </ActiveFilter>
      <OrDivider />
      <ActiveFilter
        onClick={getOnClick('bottom')}
        isActive={activeSection === 'bottom'}
      >
        {bottom(activeSection === 'top')}
      </ActiveFilter>
    </>
  );
};

interface IColumnLayout {
  children: JSX.Element[];
}

const ColumnLayout: SFC<IColumnLayout> = props => (
  <Column bgColor={LayoutBgColor.GREY} padding={16}>
    {React.Children.toArray(props.children).map(
      (child: JSX.Element, index: number) =>
        index < props.children.length - 1 ? (
          <React.Fragment key={child.key}>
            {child}
            <Hr />
          </React.Fragment>
        ) : (
          child
        ),
    )}
  </Column>
);

type TSetFilterCallback = (key: string, value: string | string[]) => void;
interface IFilterData {
  [key: string]: string | string[];
}
interface IFilterContext {
  filterData: IFilterData;
  setFilterForKey: TSetFilterCallback;
  [key: string]: IFilterData | TSetFilterCallback;
}
const initialContext = {
  filterData: {},
  setFilterForKey: (): void => null,
};
const FilterContext = createContext<IFilterContext>(initialContext);

const AdvancedFilters: SFC<{}> = () => {
  const [filtersState, setFiltersState] = useState<IFilterContext>(initialContext);

  const setFilter = (key: string, value: string | string[]) =>
    setFiltersState({
      ...filtersState,
      filterData: { ...filtersState.filterData, [key]: value },
    });

  const filterContextValue = {
    ...filtersState,
    setFilterForKey: setFilter,
  };

  const renderTop = (disabled: boolean) => (
    <TextInputFilter title="Search" disabled={disabled} />
  );
  const renderBottom = (disabled: boolean) => (
    <DropdownFilter
      title="Hierarchy"
      options={hierarchyOptions}
      disabled={disabled}
    />
  );
  return (
    <FilterContext.Provider value={filterContextValue}>
      <ColumnLayout>
        <DropdownFilter title="Brand" options={brandOptions} />
        <CheckboxFilter title="Market" options={marketOptions} />
        <OrFilter>
          {{
            top: renderTop,
            bottom: renderBottom,
          }}
        </OrFilter>
      </ColumnLayout>
    </FilterContext.Provider>
  );
};
// #endregion Advanced Filters Architecture

const CombinedPatternsStory: SFC<{}> = () => (
  <>
    <ReactMarkdown renderers={renderers} source={intro} />
    <ExampleWrapper>
      <AdvancedFilters />
    </ExampleWrapper>
    <ReactMarkdown renderers={renderers} source={intro2} />
    <DemoRow>
      <Filters />
      <AdvancedFilters />
    </DemoRow>
  </>
);

storiesOf('_PATTERNS', module).add('6 - Combining Patterns', () => (
  <CombinedPatternsStory />
));
