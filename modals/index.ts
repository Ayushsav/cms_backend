// src/models/associations.ts
import Candidate from "./Candidate/Candidate";
import Designation from "./Designation/Designation";
import Education from "./Eduction/Education";
import ReasonsForLeaving from "./ReasonForLeaving/ReasonForLeaving";
import Region from "./Region/Region";
import Tag from "./Tag/Tag";
import User from "./User/User";
import  CandidateTags  from "./CandidateTags/CandidateTags";
import CandidateReasons  from "./CandidateReasons/CandidateReasons";

// Candidate - User (Many-to-One)
Candidate.belongsTo(User, {
  foreignKey: "UserId",
  as: "user"
});
User.hasMany(Candidate, {
  foreignKey: "UserId",
  as: "candidates"
});

// Candidate - Designation (Many-to-One)
Candidate.belongsTo(Designation, {
  foreignKey: "designationId",
  as: "designation"
});
Designation.hasMany(Candidate, {
  foreignKey: "designationId",
  as: "candidates"
});

// // Candidate - Region (Many-to-One)
Candidate.belongsTo(Region, {
  foreignKey: "regionId",
  as: "region"
});
Region.hasMany(Candidate, {
  foreignKey: "regionId",
  as: "candidates"
});

// Candidate - Education (One-to-One)
Candidate.hasOne(Education, {
  foreignKey: "candidateId",
  as: "education"
});
Education.belongsTo(Candidate, {
  foreignKey: "candidateId",
  as: "candidate"
});

// Candidate - Tag (Many-to-Many)
Candidate.belongsToMany(Tag, {
  through: CandidateTags,
  foreignKey: "candidateId",
  otherKey: "tagId",
  as: "tags"
});
Tag.belongsToMany(Candidate, {
  through: CandidateTags,
  foreignKey: "tagId",
  otherKey: "candidateId",
  as: "candidates"
});

// Candidate - ReasonsForLeaving (Many-to-Many)
Candidate.belongsToMany(ReasonsForLeaving, {
  through: CandidateReasons,
  foreignKey: "candidateId",
  otherKey: "reasonId",
  as: "reasons"
});
ReasonsForLeaving.belongsToMany(Candidate, {
  through: CandidateReasons,
  foreignKey: "reasonId",
  otherKey: "candidateId",
  as: "candidates"
});

// Define the junction table interfaces
interface CandidateTag {
  candidateId: number;
  tagId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CandidateReason {
  candidateId: number;
  reasonId: number;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Update Candidate model to include association methods
declare module './Candidate/Candidate' {
  interface Candidate {
    setTags(tags: Tag[]): Promise<void>;
    getTags(): Promise<Tag[]>;
    addTag(tag: Tag): Promise<void>;
    removeTag(tag: Tag): Promise<void>;
    
    setReasons(reasons: ReasonsForLeaving[]): Promise<void>;
    getReasons(): Promise<ReasonsForLeaving[]>;
    addReason(reason: ReasonsForLeaving): Promise<void>;
    removeReason(reason: ReasonsForLeaving): Promise<void>;
    
    getEducation(): Promise<Education>;
    setEducation(education: Education): Promise<void>;
    
    getDesignation(): Promise<Designation>;
    setDesignation(designation: Designation): Promise<void>;
    
    getRegion(): Promise<Region>;
    setRegion(region: Region): Promise<void>;
    
    getUser(): Promise<User>;
    setUser(user: User): Promise<void>;
  }
}

export {
  CandidateTag,
  CandidateReason
};