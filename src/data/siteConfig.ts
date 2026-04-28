export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
}

export interface HeroConfig {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaSecondaryText: string;
  image: string;
}

export interface AboutConfig {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  stats: {
    years: string;
    clients: string;
    products: string;
    states: string;
  };
}

export interface FeaturesConfig {
  title: string;
  subtitle: string;
  items: FeatureItem[];
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface ProductsConfig {
  title: string;
  subtitle: string;
  description: string;
}

export interface ServicesConfig {
  title: string;
  subtitle: string;
  description: string;
}

export interface ContactConfig {
  title: string;
  subtitle: string;
  address: string;
  phone: string;
  email: string;
  formLabels: {
    name: string;
    email: string;
    phone: string;
    submit: string;
  };
}

export interface FooterConfig {
  description: string;
  copyright: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
}

export interface SiteConfig {
  company: {
    name: string;
    slogan: string;
    cnpj: string;
    founded: string;
    phone: string;
    email: string;
    whatsapp: string;
    address: string;
    city: string;
    state: string;
    description: string;
    logo: string;
  };
  hero: HeroConfig;
  about: AboutConfig;
  features: FeaturesConfig;
  products: ProductsConfig;
  services: ServicesConfig;
  contact: ContactConfig;
  footer: FooterConfig;
  seo: SEOConfig;
}

export const defaultSiteConfig: SiteConfig = {
  company: {
    name: "Your Company Name",
    slogan: "Your Tagline Here",
    cnpj: "00.000.000/0001-00",
    founded: "2013",
    phone: "(00) 0000-0000",
    email: "contact@example.com",
    whatsapp: "5500000000000",
    address: "Your Address Here",
    city: "Your City",
    state: "ST",
    description: "Brief description of your company and what you do.",
    logo: "/placeholder.svg",
  },
  hero: {
    title: "Your Hero Title",
    subtitle: "Your Hero Subtitle",
    description: "A brief description of your main value proposition.",
    ctaText: "Request Quote",
    ctaSecondaryText: "View Products",
    image: "/placeholder.svg",
  },
  about: {
    title: "About Us",
    subtitle: "Learn more about what we do",
    description: "A brief description of your company's mission and values.",
    image: "/placeholder.svg",
    stats: {
      years: "10+",
      clients: "500+",
      products: "100+",
      states: "20+",
    },
  },
  features: {
    title: "Our Features",
    subtitle: "What makes us different",
    items: [
      { icon: "Star", title: "Feature 1", description: "Description of feature 1." },
      { icon: "Shield", title: "Feature 2", description: "Description of feature 2." },
      { icon: "Zap", title: "Feature 3", description: "Description of feature 3." },
    ],
  },
  products: {
    title: "Our Products",
    subtitle: "What we offer",
    description: "A brief overview of the products you provide.",
  },
  services: {
    title: "Our Services",
    subtitle: "What we do",
    description: "A brief overview of the services you offer.",
  },
  contact: {
    title: "Contact Us",
    subtitle: "Get in touch",
    address: "Your Address Here",
    phone: "(00) 0000-0000",
    email: "contact@example.com",
    formLabels: {
      name: "Nome",
      email: "E-mail",
      phone: "Telefone",
      submit: "Enviar",
    },
  },
  footer: {
    description: "A brief description for the footer area.",
    copyright: "© 2026 Your Company Name. All rights reserved.",
    socialLinks: {
      facebook: "",
      instagram: "",
      linkedin: "",
      youtube: "",
    },
  },
  seo: {
    title: "Your Company Name",
    description: "Description for search engines and social media.",
    keywords: ["keyword1", "keyword2", "keyword3"],
  },
};
