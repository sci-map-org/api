import { node, Query, relation } from "cypher-query-builder";
import { LearningMaterial, LearningMaterialLabel } from "../entities/LearningMaterial";
import { UserRatedLearningMaterial, UserRatedLearningMaterialLabel } from "../entities/relationships/UserRatedLearningMaterial";
import { User, UserLabel } from "../entities/User";
import { neo4jQb } from "../infra/neo4j";
import { attachUniqueNodes } from "./util/abstract_graph_repo";

export const rateLearningMaterial = async (userId: string, learningMaterialId: string, value: number): Promise<LearningMaterial> =>
    attachUniqueNodes<User, UserRatedLearningMaterial, LearningMaterial>({
        originNode: {
            label: UserLabel,
            filter: { _id: userId },
        },
        relationship: {
            label: UserRatedLearningMaterialLabel,
            onCreateProps: {
                value,
            },
            onMergeProps: {
                value,
            },
        },
        destinationNode: {
            label: LearningMaterialLabel,
            filter: {
                _id: learningMaterialId,
            },
        },
    }).then(({ destinationNode }) => {
        return destinationNode;
    });

export const getLearningMaterialRating = async (learningMaterialId: string): Promise<number | null> => {
    const q = new Query(neo4jQb)
    q.match([
        node('lm', LearningMaterialLabel),
        relation('in', 'rel', UserRatedLearningMaterialLabel),
        node(undefined, UserLabel)
    ])
    q.where({ lm: { _id: learningMaterialId } })
    q.with(['avg(rel.value) AS rating'])
    q.return('rating')
    const results = await q.run()


    const result = results.pop();
    if (!result) throw new Error('Unable to compute rating');
    return result.rating ? Number(result.rating.toString()) : null;
};