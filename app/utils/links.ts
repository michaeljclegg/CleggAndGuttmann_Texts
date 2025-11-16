import type { NavigationMenuItem } from '@nuxt/ui'

export const navLinks: NavigationMenuItem[] = [{
  label: 'Home',
  icon: 'i-lucide-home',
  to: '/'
}, {
  label: 'Projects',
  icon: 'i-lucide-folder',
  to: '/projects'
}, {
  label: 'Latest',
  icon: 'i-lucide-file-text',
  to: '/blog'
},
{
  label: 'Texts',
  icon: 'i-lucide-mic',
  to: '/alltexts'
},
{
  label: 'Biography',
  icon: 'i-lucide-mic',
  to: '/biography'
},
{
  label: 'About',
  icon: 'i-lucide-user',
  to: '/about'
}]
