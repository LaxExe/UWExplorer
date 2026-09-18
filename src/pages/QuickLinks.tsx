import React, { useState } from 'react';
import { QuickLink } from '../types';
import {
  ExternalLink,
  Search,
  Plus,
  Briefcase,
  BookOpen,
  GraduationCap,
  Mail,
  LayoutGrid,
  FileCheck,
  MessageSquare,
  Key,
  DollarSign,
  Users,
  Library,
  Trash2,
  Edit2,
} from 'lucide-react';

interface QuickLinksProps {
  links: QuickLink[];
  onAddLink: (link: Omit<QuickLink, 'id'>) => void;
  onUpdateLink: (id: string, updated: Partial<QuickLink>) => void;
  onRemoveLink: (id: string) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Briefcase,
  BookOpen,
  GraduationCap,
  Mail,
  LayoutGrid,
  FileCheck,
  MessageSquare,
  Key,
  DollarSign,
  Users,
  Library,
};

export const QuickLinks: React.FC<QuickLinksProps> = ({
  links,
  onAddLink,
  onUpdateLink,
  onRemoveLink,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingLink, setEditingLink] = useState<QuickLink | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<QuickLink['category']>('custom');
  const [description, setDescription] = useState('');

  const categories = ['all', 'core', 'career', 'academic', 'campus', 'custom'];

  const filteredLinks = links.filter((link) => {
    const matchesCategory = selectedCategory === 'all' || link.category === selectedCategory;
    const matchesSearch =
      link.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenAdd = () => {
    setName('');
    setUrl('');
    setCategory('custom');
    setDescription('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (link: QuickLink) => {
    setEditingLink(link);
    setName(link.name);
    setUrl(link.url);
    setCategory(link.category);
    setDescription(link.description);
  };

  const handleSaveLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;

    let formattedUrl = url;
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    if (editingLink) {
      onUpdateLink(editingLink.id, {
        name,
        url: formattedUrl,
        category,
        description,
      });
      setEditingLink(null);
    } else {
      onAddLink({
        name,
        url: formattedUrl,
        category,
        description: description || 'Student shortcut.',
        iconName: 'ExternalLink',
        isCustom: true,
      });
      setIsAddModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1100px] mx-auto w-full">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold font-sans text-[var(--c5)] tracking-tight">
            Campus Services & Quick Links
          </h2>
          <p className="mono-text text-xs text-[var(--c3)] mt-0.5">
            Manage and edit links to WaterlooWorks, Quest, Outlook, LEARN, and your custom shortcuts.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="uw-button bg-[var(--c1)] text-[var(--c5)] font-semibold border-[var(--c3)]"
        >
          <Plus className="w-4 h-4" />
          <span>add link</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="uw-card p-4 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--c3)]" />
          <input
            type="text"
            placeholder="Search services (e.g. WaterlooWorks, Quest)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--bg)] border border-[var(--border)] pl-9 pr-4 py-2 font-mono text-xs text-[var(--c5)] focus:outline-none focus:border-[var(--c3)]"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`uw-button text-xs ${selectedCategory === cat ? 'active font-semibold border-[var(--c3)]' : ''}`}
            >
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLinks.map((link) => {
          const IconComponent = ICON_MAP[link.iconName] || ExternalLink;

          return (
            <div
              key={link.id}
              className="uw-card flex flex-col justify-between p-5 relative group border-[var(--border)]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 border border-[var(--border)] bg-[var(--c1)] flex items-center justify-center">
                    <IconComponent className="w-4 h-4 text-[var(--c5)]" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="uw-tag">{link.category}</span>
                    <button
                      onClick={() => handleOpenEdit(link)}
                      className="text-[var(--c3)] hover:text-[var(--c5)] transition-colors p-1"
                      title="Edit quick link"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onRemoveLink(link.id)}
                      className="text-[var(--c3)] hover:text-rose-500 transition-colors p-1"
                      title="Remove link"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-sans text-base font-bold text-[var(--c5)] mt-3 flex items-center gap-2">
                  {link.name}
                </h3>
                <p className="mono-text text-xs text-[var(--c3)] mt-1.5 leading-relaxed">
                  {link.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[var(--border)]">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="uw-button w-full justify-between"
                >
                  <span className="font-mono text-xs">launch link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {(isAddModalOpen || editingLink) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="uw-card bg-[var(--bg)] w-full max-w-md p-6 border-[var(--c4)]">
            <h3 className="font-sans text-lg font-bold text-[var(--c5)]">
              {editingLink ? 'Edit Quick Link' : 'Add Quick Link'}
            </h3>

            <form onSubmit={handleSaveLink} className="flex flex-col gap-4 mt-4">
              <div>
                <label className="mono-label block mb-1">Link Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WaterlooWorks or Course Webpage"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--c5)] focus:outline-none focus:border-[var(--c3)]"
                />
              </div>

              <div>
                <label className="mono-label block mb-1">URL *</label>
                <input
                  type="text"
                  required
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--c5)] focus:outline-none focus:border-[var(--c3)]"
                />
              </div>

              <div>
                <label className="mono-label block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as QuickLink['category'])}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--c5)] focus:outline-none focus:border-[var(--c3)]"
                >
                  <option value="core">core</option>
                  <option value="career">career</option>
                  <option value="academic">academic</option>
                  <option value="campus">campus</option>
                  <option value="custom">custom</option>
                </select>
              </div>

              <div>
                <label className="mono-label block mb-1">Description</label>
                <textarea
                  placeholder="Short description..."
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] px-3 py-2 font-mono text-xs text-[var(--c5)] focus:outline-none focus:border-[var(--c3)]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditingLink(null); }}
                  className="uw-button"
                >
                  cancel
                </button>
                <button
                  type="submit"
                  className="uw-button bg-[var(--c1)] text-[var(--c5)] font-semibold border-[var(--c3)]"
                >
                  save link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
