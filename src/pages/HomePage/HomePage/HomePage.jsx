import React from "react";
import Banner from "../Banner/Banner";
import FAQSection from "../FAQSection/FAQSection";
import OurServices from "../OurServices/OurServices";
import ProductSection from "../Product/ProductSection";
import AddHighlights from "../AddHighlights/AddHighlights";
import Loading from "../../../Shared/Loading/Loading";
import NewsLetter from "../NewsLetter/NewsLetter";
import PopularSales from "../PopularSales/PopularSales";
import MarketMarquee from "../MarketMarquee/MarketMarquee";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Banner></Banner>
      <ProductSection></ProductSection>
      <MarketMarquee></MarketMarquee>
      <OurServices></OurServices>
      <AddHighlights></AddHighlights>
      <PopularSales></PopularSales>
      <FAQSection></FAQSection>
      <NewsLetter></NewsLetter>
    </div>
  );
};

export default HomePage;
