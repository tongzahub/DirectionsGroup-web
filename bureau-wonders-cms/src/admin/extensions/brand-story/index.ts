import { prefixPluginTranslations } from '@strapi/helper-plugin';

const pluginPkg = require('../../../package.json');
const pluginId = pluginPkg.strapi?.name || 'brand-story-admin';

export default {
  register(app: any) {
    // Register custom components for brand story management
    app.customFields.register({
      name: 'character-limit-text',
      pluginId: 'brand-story-admin',
      type: 'string',
      intlLabel: {
        id: 'brand-story-admin.character-limit-text.label',
        defaultMessage: 'Character Limited Text',
      },
      intlDescription: {
        id: 'brand-story-admin.character-limit-text.description',
        defaultMessage: 'Text field with character limit and guidelines',
      },
      components: {
        Input: async () => import('../components/CharacterLimitField'),
      },
      options: {
        base: [
          {
            sectionTitle: {
              id: 'brand-story-admin.character-limit-text.section.base',
              defaultMessage: 'Base settings',
            },
            items: [
              {
                intlLabel: {
                  id: 'brand-story-admin.character-limit-text.maxLength.label',
                  defaultMessage: 'Maximum length',
                },
                name: 'options.maxLength',
                type: 'number',
                defaultValue: 100,
              },
            ],
          },
        ],
        advanced: [
          {
            sectionTitle: {
              id: 'brand-story-admin.character-limit-text.section.advanced',
              defaultMessage: 'Advanced settings',
            },
            items: [
              {
                intlLabel: {
                  id: 'brand-story-admin.character-limit-text.multiline.label',
                  defaultMessage: 'Multiline',
                },
                name: 'options.multiline',
                type: 'checkbox',
                defaultValue: false,
              },
            ],
          },
        ],
      },
    });

    // Add menu item for brand story management
    app.addMenuLink({
      to: '/content-manager/singleType/api::brand-story.brand-story',
      icon: 'book',
      intlLabel: {
        id: 'brand-story-admin.menu.brand-story',
        defaultMessage: 'Brand Story',
      },
      permissions: [
        {
          action: 'plugin::content-manager.explorer.read',
          subject: 'api::brand-story.brand-story',
        },
      ],
    });
  },

  bootstrap(app: any) {
    // Add custom styling and behavior for brand story content type
    console.log('Brand Story Admin Extension loaded');
  },

  async registerTrads({ locales }: { locales: string[] }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(`../translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};