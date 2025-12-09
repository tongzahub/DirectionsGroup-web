import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Set up public role permissions
    await setupPublicPermissions(strapi);
  },
};

/**
 * Configure public role permissions for API access
 */
async function setupPublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) {
    console.warn('Public role not found');
    return;
  }

  // Define permissions to enable for public access
  const permissionsToEnable = [
    // Page content type
    { controller: 'page', action: 'find' },
    { controller: 'page', action: 'findOne' },
    
    // Blog Post content type
    { controller: 'blog-post', action: 'find' },
    { controller: 'blog-post', action: 'findOne' },
    
    // Case Study content type
    { controller: 'case-study', action: 'find' },
    { controller: 'case-study', action: 'findOne' },
    
    // Job Listing content type
    { controller: 'job-listing', action: 'find' },
    { controller: 'job-listing', action: 'findOne' },
    
    // Site Settings (single type)
    { controller: 'site-setting', action: 'find' },
    
    // Contact Inquiry - allow creation
    { controller: 'contact-inquiry', action: 'create' },
  ];

  // Get all existing permissions for the public role
  const allPermissions = await strapi
    .query('plugin::users-permissions.permission')
    .findMany({
      where: {
        role: publicRole.id,
      },
    });

  // Update permissions
  for (const permission of permissionsToEnable) {
    const existingPermission = allPermissions.find(
      (p: any) =>
        p.action === `api::${permission.controller}.${permission.controller}.${permission.action}`
    );

    if (existingPermission && !existingPermission.enabled) {
      await strapi.query('plugin::users-permissions.permission').update({
        where: { id: existingPermission.id },
        data: { enabled: true },
      });
      console.log(`✓ Enabled public permission: ${permission.controller}.${permission.action}`);
    }
  }

  console.log('Public role permissions configured successfully');
}
