import { strapiClient } from '@/lib/strapi-client';
import Footer from './Footer';

export default async function FooterWrapper() {
  let siteSettings = null;
  
  try {
    siteSettings = await strapiClient.getSiteSettings();
  } catch (error) {
    console.error('Error fetching site settings for footer:', error);
  }

  return (
    <Footer
      contactEmail={siteSettings?.contactEmail}
      contactPhone={siteSettings?.contactPhone}
      officeAddress={siteSettings?.officeAddress}
      socialLinks={siteSettings?.socialLinks}
    />
  );
}
