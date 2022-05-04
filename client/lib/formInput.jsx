import React from "react";

export function FormInput({label, value, onChangeValue}) {
    return (
        <div className="form-input">
            <label>
                <strong>{label}</strong>{" "}
                <input value={value} onChange={(e) => onChangeValue(e.target.value)}/>
            </label>
        </div>
    );
}

export function FormTextArea({label, value, onChangeValue}) {
    return (
        <div className="form-input">
            <label>
                <strong>{label}</strong>{" "}
                <textarea value={value} onChange={(e) => onChangeValue(e.target.value)}/>
            </label>
        </div>
    );
}

export function FormTextOptions({label, value, onChangeValue}) {
    return (
        <div className="form-input">
            <div>
                <select value={value} onChange={(e) => onChangeValue(e.target.value)}>
                    <option value="Politics">Politics</option>
                    <option value="Economics">Economics</option>
                    <option value="Sport">Sport</option>
                    <option value="Health">Health</option>
                </select>
            </div>
            <strong>{label}</strong>{" "}
        </div>
    );
}
