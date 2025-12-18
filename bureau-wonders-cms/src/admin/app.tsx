import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: ['en'],
    theme: {
      light: {
        colors: {
          primary100: '#f6f0e7',
          primary200: '#e8d5b7',
          primary500: '#D4AF37',
          primary600: '#b8941f',
          primary700: '#9c7a0c',
        },
      },
    },
    head: {
      favicon: '/favicon.png',
    },
    translations: {
      en: {
        'app.components.LeftMenu.navbrand.title': 'Bureau of Wonders CMS',
        'app.components.LeftMenu.navbrand.workplace': 'Brand Story Management',
        'Auth.form.welcome.title': 'Welcome to Bureau of Wonders',
        'Auth.form.welcome.subtitle': 'Manage your brand story content',
        'HomePage.welcome': 'Welcome to Bureau of Wonders CMS',
        'HomePage.welcome.again': 'Welcome back to Bureau of Wonders CMS',
        'Settings.profile.form.section.experience.title': 'Brand Story Experience',
        'content-manager.containers.Edit.pluginHeader.title.new': 'Create Brand Story Content',
        'content-manager.containers.Edit.pluginHeader.title.edit': 'Edit Brand Story Content',
        'content-manager.containers.List.pluginHeader.title': 'Brand Story Management',
        'content-manager.components.DragLayer.item': 'Brand Story Section',
        'content-manager.success.record.save': 'Brand story content saved successfully',
        'content-manager.success.record.publish': 'Brand story published successfully',
        'content-manager.success.record.unpublish': 'Brand story unpublished successfully',
      },
    },
    menu: {
      logo: '/favicon.png',
    },
    tutorials: false,
    notifications: {
      releases: false,
    },
  },
  bootstrap(app: StrapiApp) {
    // Custom admin panel configurations
    console.log('Bureau of Wonders CMS Admin initialized');
    
    // Add custom styling for brand story management
    const style = document.createElement('style');
    style.textContent = `
      /* Custom styling for brand story admin */
      .brand-story-section {
        border-left: 4px solid #D4AF37;
        padding-left: 16px;
        margin-bottom: 24px;
      }
      
      .character-limit-warning {
        color: #f59e0b;
      }
      
      .character-limit-danger {
        color: #ef4444;
      }
      
      .storybrand-framework {
        background: linear-gradient(135deg, #f6f0e7 0%, #e8d5b7 100%);
        border-radius: 8px;
        padding: 16px;
        margin: 16px 0;
      }
      
      .workflow-step {
        display: flex;
        align-items: center;
        padding: 12px;
        border-radius: 6px;
        margin-bottom: 8px;
        transition: background-color 0.2s ease;
      }
      
      .workflow-step:hover {
        background-color: #f8f9fa;
      }
      
      .content-quality-high {
        border-left: 4px solid #10b981;
      }
      
      .content-quality-medium {
        border-left: 4px solid #f59e0b;
      }
      
      .content-quality-low {
        border-left: 4px solid #ef4444;
      }
    `;
    document.head.appendChild(style);
  },
};