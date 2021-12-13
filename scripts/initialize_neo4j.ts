// ====deprecated==== CALL db.index.fulltext.createNodeIndex("namesAndDescriptions",["Domain", "Concept", "LearningGoal", "Resource", "LearningPath"],["name", "key", "description", "type", "topicType"])
// CALL db.index.fulltext.createNodeIndex("namesAndDescription",["Topic", "Resource", "LearningPath"],["name", "key", "description", "type", "topicType"])
// CREATE CONSTRAINT unique_topic_keys ON (n:Topic) ASSERT n.key IS UNIQUE
// CREATE CONSTRAINT unique_resource_keys ON (n:Resource) ASSERT n.key IS UNIQUE
// CREATE CONSTRAINT unique_learning_paths_keys ON (n:LearningPath) ASSERT n.key IS UNIQUE
// CREATE CONSTRAINT unique_learning_goals_keys ON (n:LearningGoal) ASSERT n.key IS UNIQUE
// CREATE CONSTRAINT unique_topic_ids ON (n:Topic) ASSERT n._id IS UNIQUE
// CREATE CONSTRAINT unique_learning_material_ids ON (n:LearningMaterial) ASSERT n._id IS UNIQUE
// CREATE CONSTRAINT unique_learning_goals_ids ON (n:LearningGoal) ASSERT n._id IS UNIQUE
