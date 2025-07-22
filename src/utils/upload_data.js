import { supabase } from "#/supabase";

// ✅ Required field names
const REQUIRED_FIELDS = [
  "photo",
  "fullName",
  "primaryPhone",
  "address",
  "gender",
  "age",
  "visitationDate",
  "inviterName",
  "inviterPhone",
  "followUpLeader",
  "foundationStatus",
  "foundationTeacher",
  "ministersStatus",
  "ministersTeacher",
  "ministryJoined",
  "cellGroupStatus",
  "assignedCellGroup",
];

export async function uploadVisitorData(formData) {
  // ✅ Check for missing fields
  for (const field of REQUIRED_FIELDS) {
    if (!formData[field]) {
      return {
        success: false,
        error: `Missing required field: ${field}`,
      };
    }
  }

  try {
    // ✅ Upload image to Supabase Storage
    const file = formData.photo;
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `newVisitors/${fileName}`;

    const { error: storageError } = await supabase.storage
      .from("images")
      .upload(filePath, file);

    if (storageError) {
      return {
        success: false,
        error: `Image upload failed: ${storageError.message}`,
      };
    }

    const { data: publicUrlData } = supabase.storage
      .from("images")
      .getPublicUrl(filePath);

    const imageUrl = publicUrlData?.publicUrl;

    // ✅ Prepare data for insert
    // ✅ Map fields to your DB column names
    const visitorData = {
      image: imageUrl, // renamed from 'photo'
      full_name: formData.fullName,
      primary_phone_num: formData.primaryPhone,
      secondary_phone_num: formData.secondaryPhone, // if you have this
      address: formData.address,
      gender: formData.gender,
      age: formData.age,
      born_again_date: formData.visitationDate, // if you have this in your form
      iow_name: formData.inviterName,
      iow_phone_num: formData.inviterPhone,
      follow_up_leader: formData.followUpLeader,
      foundation_class_status: formData.foundationStatus,
      foundation_class_teacher: formData.foundationTeacher,
      ministers_training_status: formData.ministersStatus,
      ministers_training_teacher: formData.ministersTeacher,
      ministry_joined: formData.ministryJoined,
      cell_group_status: formData.cellGroupStatus,
      assigned_cell_group: formData.assignedCellGroup,
      // registered_at can be defaulted by DB
    };

    // ✅ Upload to "newVisitors" table
    const { error: insertError } = await supabase
      .from("newVisitors")
      .insert(visitorData);

    if (insertError) {
      return {
        success: false,
        error: `Data insert failed: ${insertError.message}`,
      };
    }

    return {
      success: true,
    };
  } catch (err) {
    return {
      success: false,
      error: `Unexpected error: ${err.message}`,
    };
  }
}
