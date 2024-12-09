'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { HiLightBulb, HiPencil, HiPlus, HiX } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const TopicCard = ({ topic, onEdit, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="bg-white rounded-lg p-4 shadow-sm space-y-3"
  >
    <div className="flex items-center justify-between">
      <h3 className="font-medium text-lg">{topic.title}</h3>
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onEdit(topic)}
        >
          <HiPencil className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onDelete(topic.id)}
        >
          <HiX className="w-4 h-4" />
        </Button>
      </div>
    </div>
    <p className="text-gray-600 text-sm">{topic.description}</p>
    {topic.keywords?.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {topic.keywords.map((keyword, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs"
          >
            {keyword}
          </span>
        ))}
      </div>
    )}
  </motion.div>
);

export default function TopicEditor({ initialTopics = [], onChange }) {
  const [topics, setTopics] = useState(initialTopics);
  const [editingTopic, setEditingTopic] = useState(null);
  const [newTopic, setNewTopic] = useState({
    title: '',
    description: '',
    keywords: []
  });
  const [keywordInput, setKeywordInput] = useState('');

  const handleAddKeyword = () => {
    if (!keywordInput.trim()) return;
    
    const keyword = keywordInput.trim();
    if (editingTopic) {
      setEditingTopic(prev => ({
        ...prev,
        keywords: [...(prev.keywords || []), keyword]
      }));
    } else {
      setNewTopic(prev => ({
        ...prev,
        keywords: [...(prev.keywords || []), keyword]
      }));
    }
    setKeywordInput('');
  };

  const handleRemoveKeyword = (index) => {
    if (editingTopic) {
      setEditingTopic(prev => ({
        ...prev,
        keywords: prev.keywords.filter((_, i) => i !== index)
      }));
    } else {
      setNewTopic(prev => ({
        ...prev,
        keywords: prev.keywords.filter((_, i) => i !== index)
      }));
    }
  };

  const handleAddTopic = () => {
    if (!newTopic.title.trim() || !newTopic.description.trim()) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    const updatedTopics = [...topics, { ...newTopic, id: Date.now().toString() }];
    setTopics(updatedTopics);
    setNewTopic({ title: '', description: '', keywords: [] });
    onChange?.(updatedTopics);
    toast.success('Tema agregado exitosamente');
  };

  const handleEditTopic = (topic) => {
    setEditingTopic(topic);
    setNewTopic({ title: '', description: '', keywords: [] });
  };

  const handleUpdateTopic = () => {
    if (!editingTopic.title.trim() || !editingTopic.description.trim()) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    const updatedTopics = topics.map(topic =>
      topic.id === editingTopic.id ? editingTopic : topic
    );
    setTopics(updatedTopics);
    setEditingTopic(null);
    onChange?.(updatedTopics);
    toast.success('Tema actualizado exitosamente');
  };

  const handleDeleteTopic = (topicId) => {
    const updatedTopics = topics.filter(topic => topic.id !== topicId);
    setTopics(updatedTopics);
    onChange?.(updatedTopics);
    toast.success('Tema eliminado exitosamente');
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-6 shadow-sm space-y-4"
      >
        <div className="flex items-center gap-2 text-lg font-medium text-orange-600">
          <HiLightBulb className="w-5 h-5" />
          <h2>{editingTopic ? 'Editar Tema' : 'Nuevo Tema'}</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Título del Tema
            </label>
            <Input
              value={editingTopic ? editingTopic.title : newTopic.title}
              onChange={(e) => {
                if (editingTopic) {
                  setEditingTopic(prev => ({ ...prev, title: e.target.value }));
                } else {
                  setNewTopic(prev => ({ ...prev, title: e.target.value }));
                }
              }}
              placeholder="Ej: Introducción a la Programación"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Descripción
            </label>
            <Textarea
              value={editingTopic ? editingTopic.description : newTopic.description}
              onChange={(e) => {
                if (editingTopic) {
                  setEditingTopic(prev => ({ ...prev, description: e.target.value }));
                } else {
                  setNewTopic(prev => ({ ...prev, description: e.target.value }));
                }
              }}
              placeholder="Describe el tema..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Palabras Clave
            </label>
            <div className="flex gap-2">
              <Input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                placeholder="Agrega palabras clave"
              />
              <Button
                onClick={handleAddKeyword}
                disabled={!keywordInput.trim()}
                size="icon"
              >
                <HiPlus className="w-4 h-4" />
              </Button>
            </div>
            {/* Keywords Display */}
            <div className="flex flex-wrap gap-2 mt-2">
              {(editingTopic ? editingTopic.keywords : newTopic.keywords)?.map((keyword, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                >
                  {keyword}
                  <button
                    onClick={() => handleRemoveKeyword(index)}
                    className="p-1 hover:bg-orange-200 rounded-full"
                  >
                    <HiX className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            {editingTopic && (
              <Button
                variant="outline"
                onClick={() => setEditingTopic(null)}
              >
                Cancelar
              </Button>
            )}
            <Button
              onClick={editingTopic ? handleUpdateTopic : handleAddTopic}
            >
              {editingTopic ? 'Actualizar Tema' : 'Agregar Tema'}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Topics List */}
      <div className="space-y-4">
        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            onEdit={handleEditTopic}
            onDelete={handleDeleteTopic}
          />
        ))}
      </div>
    </div>
  );
}
